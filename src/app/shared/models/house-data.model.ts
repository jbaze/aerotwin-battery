export interface HouseData {
  batteryLevel: number;
  batteryStatus: 'charging' | 'discharging' | 'idle';
  solarProduction: number;
  homeConsumption: number;
  gridConnection: 'importing' | 'exporting' | 'idle';
  energyFlows: EnergyFlow[];
}

export interface EnergyFlow {
  from: 'solar' | 'battery' | 'grid';
  to: 'battery' | 'home' | 'grid';
  amount: number;
  isActive: boolean;
}

export interface BatteryInfo {
  level: number;
  capacity: number;
  temperature: number;
  voltage: number;
  status: 'charging' | 'discharging' | 'idle';
  health: number;
}
