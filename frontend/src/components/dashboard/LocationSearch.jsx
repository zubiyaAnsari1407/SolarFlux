import {
  MapPin,
  Search,
  Navigation
} from "lucide-react";

function LocationSearch({
  locationInput,
  setLocationInput,
  onManualSearch,
  onUseMyLocation,
  loading,
  theme
}) {

  const inputTextColor = theme?.isDark
    ? "#F5F7FA"
    : "#1F2B3A";

  const placeholderColor = theme?.isDark
    ? "rgba(245, 247, 250, 0.55)"
    : "rgba(31, 43, 58, 0.50)";

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "10px",
        marginBottom: "18px"
      }}
    >

      {/* =====================================================
          USE MY LOCATION
      ===================================================== */}

      <button
        type="button"
        onClick={onUseMyLocation}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 14px",
          borderRadius: "12px",

          border: `1px solid ${
            theme?.border ?? "rgba(255,255,255,0.20)"
          }`,

          background:
            theme?.cardBg ??
            "rgba(255,255,255,0.12)",

          color:
            theme?.text ?? "#1F2B3A",

          cursor:
            loading
              ? "not-allowed"
              : "pointer"
        }}
      >
        <Navigation
          size={17}
          strokeWidth={1.8}
        />

        Use My Location
      </button>


      {/* =====================================================
          MANUAL LOCATION FORM
      ===================================================== */}

      <form
        onSubmit={onManualSearch}
        style={{
          display: "flex",
          flex: 1,
          minWidth: "260px",
          gap: "8px"
        }}
      >

        {/* INPUT CONTAINER */}

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            gap: "8px",
            padding: "10px 12px",
            borderRadius: "12px",

            background:
              theme?.cardBg ??
              "rgba(255,255,255,0.12)",

            border: `1px solid ${
              theme?.border ??
              "rgba(255,255,255,0.20)"
            }`,

            backdropFilter: "blur(14px)"
          }}
        >

          <MapPin
            size={17}
            strokeWidth={1.8}
            style={{
              color:
                theme?.muted ??
                inputTextColor
            }}
          />

          <input
            type="text"
            value={locationInput}
            onChange={(e) =>
              setLocationInput(
                e.target.value
              )
            }
            placeholder="Enter area, city e.g. Byculla, Mumbai"
            className="solarflux-location-input"
            style={{
              flex: 1,

              minWidth: 0,

              border: "none",
              outline: "none",

              background:
                "transparent",

              color:
                inputTextColor,

              caretColor:
                inputTextColor,

              fontSize: "14px",

              fontWeight: 500,

              "--placeholder-color":
                placeholderColor
            }}
          />

        </div>


        {/* SEARCH BUTTON */}

        <button
          type="submit"
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",

            padding:
              "10px 14px",

            borderRadius:
              "12px",

            border: `1px solid ${
              theme?.border ??
              "rgba(255,255,255,0.20)"
            }`,

            background:
              theme?.cardBg ??
              "rgba(255,255,255,0.12)",

            color:
              theme?.text ??
              "#1F2B3A",

            cursor:
              loading
                ? "not-allowed"
                : "pointer"
          }}
        >

          <Search
            size={17}
            strokeWidth={1.8}
          />

          {loading
            ? "Loading..."
            : "Search"}

        </button>

      </form>

    </div>
  );
}

export default LocationSearch;