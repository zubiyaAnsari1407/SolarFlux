def generate_warning(
    weather_alert=None,
    production_drop=None,
    anomaly_result=None
):

    warnings = []

    # ========================================================
    # WEATHER WARNING
    # ========================================================

    if weather_alert:

        warnings.append({
            "source": "weather",
            "severity": "warning",
            "title": weather_alert.get(
                "title",
                "Weather warning"
            ),
            "message": weather_alert.get(
                "message",
                "Weather conditions may affect solar generation."
            )
        })


    # ========================================================
    # PRODUCTION DROP WARNING
    # ========================================================

    if production_drop:

        severity = production_drop.get(
            "severity",
            "normal"
        )

        if severity != "normal":

            warnings.append({
                "source": "production",
                "severity": severity,
                "title": "Solar production drop",
                "message": production_drop.get(
                    "message",
                    "Solar generation is below expectation."
                )
            })


    # ========================================================
    # ANOMALY WARNING
    # ========================================================

    if anomaly_result:

        if anomaly_result.get(
            "isAnomaly",
            False
        ):

            warnings.append({
                "source": "anomaly",
                "severity": anomaly_result.get(
                    "severity",
                    "warning"
                ),
                "title": "Solar anomaly detected",
                "message": anomaly_result.get(
                    "message",
                    "Unusual solar generation behavior detected."
                )
            })


    # ========================================================
    # SEVERITY PRIORITY
    # ========================================================

    severity_rank = {
        "normal": 0,
        "watch": 1,
        "warning": 2,
        "critical": 3
    }


    if not warnings:

        final_severity = "normal"

        final_status = (
            "No major solar system warning detected."
        )

    else:

        final_severity = max(
            warnings,
            key=lambda item:
                severity_rank.get(
                    item["severity"],
                    0
                )
        )["severity"]


        if final_severity == "critical":

            final_status = (
                "Critical solar system attention required."
            )

        elif final_severity == "warning":

            final_status = (
                "Solar system warning detected."
            )

        elif final_severity == "watch":

            final_status = (
                "Solar system should be monitored."
            )

        else:

            final_status = (
                "Solar system operating normally."
            )


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "severity":
            final_severity,

        "status":
            final_status,

        "warningCount":
            len(warnings),

        "warnings":
            warnings
    }