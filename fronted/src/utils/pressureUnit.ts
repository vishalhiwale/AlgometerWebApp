export const convertPressure = (
    value: number | null,
    unit: string = "kPa"
): number | null => {
    if (value === null) return null;

    switch (unit) {
        case "Pa":
            return value * 1000;

        case "MPa":
            return value / 1000;

        case "N/cm²":
            return value / 10;

        case "kgf/cm²":
            return value * 0.0101972;

        case "psi":
            return value * 0.145038;

        default:
            return value;
    }
};