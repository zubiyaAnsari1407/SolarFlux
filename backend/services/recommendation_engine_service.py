# ============================================================
# SMART RECOMMENDATION ENGINE
# ============================================================

def generate_smart_recommendations(
    weather_risk=False,
    rain_probability=0,
    production_drop_percent=0,
    anomaly_detected=False,
    anomaly_severity="normal",
    battery_percentage=None
):

    recommendations = []


    # ========================================================
    # WEATHER / RAIN RECOMMENDATION
    # ========================================================

    if weather_risk:

        recommendations.append({

            "type": "weather",

            "priority": "medium",

            "title":
                "Prepare for lower solar generation",

            "message": (
                f"Rain or heavy cloud conditions are expected "
                f"with around {rain_probability}% rain probability. "
                f"Use available solar energy efficiently today "
                f"and keep the battery sufficiently charged."
            )
        })


    # ========================================================
    # PRODUCTION DROP RECOMMENDATION
    # ========================================================

    if production_drop_percent >= 15:

        recommendations.append({

            "type": "production",

            "priority": (
                "high"
                if production_drop_percent >= 30
                else "medium"
            ),

            "title":
                "Inspect solar system performance",

            "message": (
                f"Solar generation is approximately "
                f"{production_drop_percent:.1f}% below expectation. "
                f"Check for panel shading, dust accumulation, "
                f"loose wiring, inverter issues or sensor errors."
            )
        })


    # ========================================================
    # ANOMALY RECOMMENDATION
    # ========================================================

    if anomaly_detected:

        if anomaly_severity == "critical":

            priority = "high"

            message = (
                "A critical solar performance anomaly was detected. "
                "Inspect panel output, inverter status, wiring and "
                "sensor readings before normal operation continues."
            )

        else:

            priority = "medium"

            message = (
                "An unusual solar generation pattern was detected. "
                "Monitor the system and verify panel, inverter and "
                "sensor readings."
            )


        recommendations.append({

            "type": "anomaly",

            "priority": priority,

            "title":
                "Investigate unusual solar behavior",

            "message":
                message
        })


    # ========================================================
    # BATTERY RECOMMENDATION
    # ========================================================

    if battery_percentage is not None:

        if battery_percentage < 20:

            recommendations.append({

                "type": "battery",

                "priority": "high",

                "title":
                    "Battery level is low",

                "message": (
                    f"Battery level is only "
                    f"{battery_percentage:.0f}%. "
                    f"Reduce unnecessary consumption "
                    f"and prioritize battery charging."
                )
            })

        elif (
            weather_risk
            and battery_percentage < 50
        ):

            recommendations.append({

                "type": "battery",

                "priority": "medium",

                "title":
                    "Charge battery before poor weather",

                "message": (
                    f"Battery is at "
                    f"{battery_percentage:.0f}%. "
                    f"Since lower solar generation is expected, "
                    f"consider charging the battery before "
                    f"the low-generation period."
                )
            })


    # ========================================================
    # NO ISSUES
    # ========================================================

    if not recommendations:

        recommendations.append({

            "type": "system",

            "priority": "low",

            "title":
                "System operating normally",

            "message": (
                "No major solar performance issue was detected. "
                "Continue normal operation and monitoring."
            )
        })


    # ========================================================
    # PRIORITY SORTING
    # ========================================================

    priority_rank = {
        "high": 3,
        "medium": 2,
        "low": 1
    }


    recommendations.sort(
        key=lambda item:
            priority_rank.get(
                item["priority"],
                0
            ),
        reverse=True
    )


    # ========================================================
    # PRIMARY RECOMMENDATION
    # ========================================================

    primary_recommendation = (
        recommendations[0]
    )


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "recommendationCount":
            len(recommendations),

        "primaryRecommendation":
            primary_recommendation,

        "recommendations":
            recommendations
    }