# ============================================================
# PRODUCTION DROP DETECTION
# ============================================================

DEFAULT_DROP_THRESHOLD_PERCENT = 15.0


def detect_production_drop(
    expected_generation_kwh,
    actual_generation_kwh,
    threshold_percent=DEFAULT_DROP_THRESHOLD_PERCENT
):

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if expected_generation_kwh <= 0:
        raise ValueError(
            "Expected generation must be greater than 0."
        )

    if actual_generation_kwh < 0:
        raise ValueError(
            "Actual generation cannot be negative."
        )

    if threshold_percent <= 0:
        raise ValueError(
            "Threshold must be greater than 0."
        )


    expected = float(
        expected_generation_kwh
    )

    actual = float(
        actual_generation_kwh
    )


    # --------------------------------------------------------
    # GENERATION DIFFERENCE
    # --------------------------------------------------------

    generation_gap = (
        expected - actual
    )


    # --------------------------------------------------------
    # DROP PERCENTAGE
    # --------------------------------------------------------

    if actual >= expected:

        drop_percent = 0.0

    else:

        drop_percent = (
            generation_gap
            / expected
        ) * 100


    # --------------------------------------------------------
    # PERFORMANCE RATIO
    # --------------------------------------------------------

    performance_percent = (
        actual
        / expected
    ) * 100


    # --------------------------------------------------------
    # DETECT UNDERPERFORMANCE
    # --------------------------------------------------------

    underperformance_detected = (
        drop_percent
        >= threshold_percent
    )


    # --------------------------------------------------------
    # SEVERITY
    # --------------------------------------------------------

    if actual >= expected:

        severity = "normal"

        status = (
            "Generation is meeting "
            "or exceeding expectation."
        )

    elif drop_percent < 10:

        severity = "normal"

        status = (
            "Generation is slightly below expectation."
        )

    elif drop_percent < 20:

        severity = "watch"

        status = (
            "A moderate production drop was detected."
        )

    elif drop_percent < 35:

        severity = "warning"

        status = (
            "Significant solar underperformance detected."
        )

    else:

        severity = "critical"

        status = (
            "Large solar production drop detected."
        )


    # --------------------------------------------------------
    # USER-FRIENDLY MESSAGE
    # --------------------------------------------------------

    if not underperformance_detected:

        message = (
            f"Actual generation is "
            f"{actual:.2f} kWh compared with an "
            f"expected {expected:.2f} kWh. "
            f"No significant production drop "
            f"was detected."
        )

    else:

        message = (
            f"Actual generation is "
            f"{actual:.2f} kWh compared with an "
            f"expected {expected:.2f} kWh. "
            f"Production is approximately "
            f"{drop_percent:.1f}% below expectation."
        )


    # --------------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------------

    return {

        "expectedGeneration":
            round(
                expected,
                2
            ),

        "actualGeneration":
            round(
                actual,
                2
            ),

        "unit":
            "kWh",

        "generationGap":
            round(
                generation_gap,
                2
            ),

        "dropPercentage":
            round(
                max(
                    0,
                    drop_percent
                ),
                2
            ),

        "performancePercentage":
            round(
                performance_percent,
                2
            ),

        "thresholdPercentage":
            round(
                threshold_percent,
                2
            ),

        "underperformanceDetected":
            underperformance_detected,

        "severity":
            severity,

        "status":
            status,

        "message":
            message,

        "note": (
            "This detects a production deviation only. "
            "It does not by itself diagnose the cause. "
            "Possible causes can later be investigated "
            "using sensor, inverter and environmental data."
        )
    }