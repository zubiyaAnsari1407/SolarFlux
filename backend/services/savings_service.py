from services.solar_prediction_service import (
    predict_tomorrow_solar
)


# ============================================================
# DEFAULT TARIFF
# ============================================================

DEFAULT_TARIFF_PER_KWH = 8.0


# ============================================================
# CALCULATE PREDICTED SAVINGS
# ============================================================

def calculate_predicted_savings(
    location=None,
    latitude=None,
    longitude=None,
    tariff_per_kwh=DEFAULT_TARIFF_PER_KWH
):

    if tariff_per_kwh <= 0:
        raise ValueError(
            "Electricity tariff must be greater than 0."
        )


    # --------------------------------------------------------
    # GET TOMORROW SOLAR PREDICTION
    # --------------------------------------------------------

    prediction_data = predict_tomorrow_solar(
        location=location,
        latitude=latitude,
        longitude=longitude
    )


    predicted_generation = float(
        prediction_data["predictedGeneration"]
    )


    # --------------------------------------------------------
    # SAVINGS FORMULA
    # --------------------------------------------------------
    #
    # Estimated savings
    # =
    # predicted solar generation
    # × electricity tariff
    #
    # Example:
    #
    # 18.63 kWh × ₹8/kWh
    # = ₹149.04
    # --------------------------------------------------------

    estimated_savings = (
        predicted_generation
        * tariff_per_kwh
    )


    # --------------------------------------------------------
    # MONTHLY PROJECTION
    # --------------------------------------------------------
    #
    # This is only a simple projection assuming
    # similar daily generation.
    # It is NOT a monthly ML forecast.
    # --------------------------------------------------------

    projected_monthly_savings = (
        estimated_savings
        * 30
    )


    projected_monthly_generation = (
        predicted_generation
        * 30
    )


    # --------------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------------

    return {

        "location":
            prediction_data["location"],

        "predictionDate":
            prediction_data["predictionDate"],

        "predictedGeneration":
            round(
                predicted_generation,
                2
            ),

        "generationUnit":
            "kWh",

        "electricityTariff":
            round(
                tariff_per_kwh,
                2
            ),

        "tariffUnit":
            "INR/kWh",

        "estimatedSavings":
            round(
                estimated_savings,
                2
            ),

        "currency":
            "INR",

        "projectedMonthlyGeneration":
            round(
                projected_monthly_generation,
                2
            ),

        "projectedMonthlySavings":
            round(
                projected_monthly_savings,
                2
            ),

        "calculationType":
            "Potential solar energy value",

        "note": (
            "Estimated savings assume each predicted "
            "solar kWh offsets electricity purchased "
            "at the selected tariff. Actual bill savings "
            "may vary with self-consumption, export rates "
            "and net-metering rules."
        )
    }