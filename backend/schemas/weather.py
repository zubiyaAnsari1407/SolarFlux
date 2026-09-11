from pydantic import BaseModel, Field, model_validator
from typing import Optional


class WeatherLocationRequest(BaseModel):
    location: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    latitude: Optional[float] = Field(
        default=None,
        ge=-90,
        le=90
    )

    longitude: Optional[float] = Field(
        default=None,
        ge=-180,
        le=180
    )

    @model_validator(mode="after")
    def validate_location_source(self):

        has_manual_location = bool(
            self.location and self.location.strip()
        )

        has_coordinates = (
            self.latitude is not None
            and self.longitude is not None
        )

        if not has_manual_location and not has_coordinates:
            raise ValueError(
                "Provide either a location or GPS coordinates."
            )

        if (
            (self.latitude is None) !=
            (self.longitude is None)
        ):
            raise ValueError(
                "Latitude and longitude must be provided together."
            )

        return self