export class Utils {
    constructor() {
    }
    
    static kelvinToCelsius = (kelvin) => {
        return kelvin - 273.15;
    }

    static secondToKilometer = (metter) => {
        return metter / 1000 * 3600;
    }

    static degreeToDirection = (degree) => {
        if (degree > 337.5 || degree <= 22.5) {
            return "NORD";
        } else if (degree > 22.5 && degree <= 67.5) {
            return "NORD-EST";
        } else if (degree > 67.5 && degree <= 112.5) {
            return "EST";
        } else if (degree > 112.5 && degree <= 157.5) {
            return "SUD-EST";
        } else if (degree > 157.5 && degree <= 202.5) {
            return "SUD";
        } else if (degree > 202.5 && degree <= 247.5) {
            return "SUD-OUEST";
        } else if (degree > 247.5 && degree <= 292.5) {
            return "OUEST";
        } else if (degree > 292.5 && degree <= 337.5) {
            return "NORD-OUEST";
        }
    }
}