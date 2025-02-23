import { FC } from "react";

// Import SVG icons as React Components
import BatteryIcon from "../../assets/icons/battery.svg";
import InteriorIcon from "../../assets/icons/interior.svg";
import OilIcon from "../../assets/icons/oil.svg";
import TireIcon from "../../assets/icons/tire.svg";
import BrakeIcon from "../../assets/icons/brake.svg";
import AcIcon from "../../assets/icons/ac.svg";
import EngineIcon from "../../assets/icons/engine.svg";
import ExhaustIcon from "../../assets/icons/exhaust.svg";
import GearIcon from "../../assets/icons/gear.svg";
import DistributionIcon from "../../assets/icons/distribution.svg";
import HeadlightIcon from "../../assets/icons/headlights.svg";
import BodyIcon from "../../assets/icons/body.svg";
import SensorIcon from "../../assets/icons/sensor.svg";
import WindshieldIcon from "../../assets/icons/windshield.svg";
import GasketIcon from "../../assets/icons/gasket.svg";
import TrailerIcon from "../../assets/icons/trailer.svg";
import CleaningIcon from "../../assets/icons/cleaning.svg";
import ToolsIcon from "../../assets/icons/tools.svg";
import AccessoriesIcon from "../../assets/icons/accessories.svg";


// Define the available icons
const iconsMap: Record<string, FC<{ width?: number | string; height?: number | string }>> = {
  battery: BatteryIcon,
  interior: InteriorIcon,
  oil: OilIcon,
  tire: TireIcon,
  brake:BrakeIcon,
  ac:AcIcon,
  engine:EngineIcon,
  gear:GearIcon,
  distribution:DistributionIcon,
  exhaust:ExhaustIcon,
  headlights:HeadlightIcon,
  body:BodyIcon,
  sensor:SensorIcon,
  windshield:WindshieldIcon,
  gasket:GasketIcon,
  trailer:TrailerIcon,
  cleaning:CleaningIcon,
  tools:ToolsIcon,
  accessories:AccessoriesIcon
};

// Props for the IconComponent
interface Props {
  name?: keyof typeof iconsMap;
  size?: number;
}

// The actual IconComponent
const IconComponent: FC<Props> = ({ name, size = 20 }) => {
  const SelectedIcon = name ? iconsMap[name] : null;
  return SelectedIcon ? <SelectedIcon width={size} height={size} /> : null;
};

export default IconComponent;
