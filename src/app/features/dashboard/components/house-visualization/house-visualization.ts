import { Component, OnDestroy, OnInit } from '@angular/core';
import { BatteryInfo, EnergyFlow, HouseData } from '../../../../shared/models/house-data.model';
import { interval, Subscription } from 'rxjs';
import { SyntheticDataService } from '../../../../shared/services/synthetic-data';
import { Optimization } from '../../../../shared/services/optimization';

@Component({
  selector: 'app-house-visualization',
  standalone: false,
  templateUrl: './house-visualization.html',
  styleUrl: './house-visualization.scss'
})
export class HouseVisualization implements OnInit, OnDestroy {
  houseData: HouseData = this.getInitialHouseData();
  batteryInfo: BatteryInfo = this.getInitialBatteryInfo();
  isOptimized = false;
  isTransitioning = false;
  optimizationProgress = 0;

  private subscription = new Subscription();

  constructor(
    private syntheticDataService: SyntheticDataService,
    private optimizationService: Optimization
  ) {}

  ngOnInit(): void {
    // Listen for optimization state changes
    this.subscription.add(
      this.optimizationService.optimizationState$.subscribe(result => {
        const wasOptimized = this.isOptimized;
        this.isOptimized = result?.isApplied || false;

        if (wasOptimized !== this.isOptimized) {
          this.triggerOptimizationTransition();
        }
      })
    );

    // Update house data every 10 seconds
    this.subscription.add(
      interval(10000).subscribe(() => {
        this.updateHouseData();
      })
    );

    // Initial data load
    this.updateHouseData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private triggerOptimizationTransition(): void {
    this.isTransitioning = true;
    this.optimizationProgress = 0;

    // Animate optimization progress
    const progressInterval = setInterval(() => {
      this.optimizationProgress += 10;
      if (this.optimizationProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          this.isTransitioning = false;
        }, 1000);
      }
    }, 100);
  }

  private updateHouseData(): void {
    if (this.isOptimized) {
      this.houseData = this.getOptimizedHouseData();
      this.batteryInfo = this.getOptimizedBatteryInfo();
    } else {
      this.houseData = this.getCurrentHouseData();
      this.batteryInfo = this.getCurrentBatteryInfo();
    }
  }

  private getInitialHouseData(): HouseData {
    return {
      batteryLevel: 78,
      batteryStatus: 'charging',
      solarProduction: 6.5,
      homeConsumption: 3.8,
      gridConnection: 'exporting',
      energyFlows: []
    };
  }

  private getInitialBatteryInfo(): BatteryInfo {
    return {
      level: 78,
      capacity: 13.5,
      temperature: 23,
      voltage: 425,
      status: 'charging',
      health: 98
    };
  }

  private getCurrentHouseData(): HouseData {
    const hour = new Date().getHours();
    return {
      batteryLevel: Math.round(65 + Math.random() * 20), // 65-85%
      batteryStatus: this.getRandomBatteryStatus(),
      solarProduction: this.getSolarProduction(),
      homeConsumption: Math.round(3.2 + Math.random() * 2), // 3.2-5.2 kW
      gridConnection: this.getGridConnection(),
      energyFlows: this.generateCurrentEnergyFlows()
    };
  }

  private getOptimizedHouseData(): HouseData {
    const hour = new Date().getHours();
    return {
      batteryLevel: Math.round(75 + Math.random() * 15), // 75-90% (higher efficiency)
      batteryStatus: this.getOptimizedBatteryStatus(),
      solarProduction: this.getSolarProduction(), // Same solar production
      homeConsumption: Math.round(2.8 + Math.random() * 1.5), // 2.8-4.3 kW (more efficient)
      gridConnection: this.getOptimizedGridConnection(),
      energyFlows: this.generateOptimizedEnergyFlows()
    };
  }

  private getCurrentBatteryInfo(): BatteryInfo {
    return {
      level: this.houseData.batteryLevel,
      capacity: 13.5,
      temperature: Math.round(22 + Math.random() * 4), // 22-26°C
      voltage: Math.round(400 + Math.random() * 50), // 400-450V
      status: this.houseData.batteryStatus,
      health: Math.round(95 + Math.random() * 4) // 95-99%
    };
  }

  private getOptimizedBatteryInfo(): BatteryInfo {
    return {
      level: this.houseData.batteryLevel,
      capacity: 13.5,
      temperature: Math.round(20 + Math.random() * 3), // 20-23°C (cooler, more efficient)
      voltage: Math.round(420 + Math.random() * 30), // 420-450V (more stable)
      status: this.houseData.batteryStatus,
      health: Math.round(97 + Math.random() * 2) // 97-99% (better health)
    };
  }

  private getRandomBatteryStatus(): 'charging' | 'discharging' | 'idle' {
    const hour = new Date().getHours();
    if (hour >= 10 && hour <= 16) {
      return Math.random() > 0.3 ? 'charging' : 'idle';
    } else if (hour >= 18 && hour <= 22) {
      return Math.random() > 0.4 ? 'discharging' : 'idle';
    }
    return 'idle';
  }

  private getOptimizedBatteryStatus(): 'charging' | 'discharging' | 'idle' {
    const hour = new Date().getHours();
    // Optimized: charge during cheap hours, discharge during expensive hours
    if (hour >= 2 && hour <= 6) {
      return 'charging'; // Cheap rate charging
    } else if (hour >= 18 && hour <= 21) {
      return 'discharging'; // Peak rate discharging
    } else if (hour >= 10 && hour <= 16) {
      return Math.random() > 0.7 ? 'charging' : 'idle'; // Smart solar charging
    }
    return 'idle';
  }

  private getSolarProduction(): number {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 18) {
      const peak = 12;
      const distance = Math.abs(hour - peak);
      const multiplier = Math.max(0.1, 1 - (distance / 6) * 0.8);
      return Math.round((8 * multiplier + Math.random() * 2) * 10) / 10;
    }
    return 0;
  }

  private getGridConnection(): 'importing' | 'exporting' | 'idle' {
    const solar = this.houseData?.solarProduction || 0;
    const consumption = this.houseData?.homeConsumption || 0;

    if (solar > consumption + 1) {
      return 'exporting';
    } else if (consumption > solar + 1) {
      return 'importing';
    }
    return 'idle';
  }

  private getOptimizedGridConnection(): 'importing' | 'exporting' | 'idle' {
    const solar = this.houseData?.solarProduction || 0;
    const consumption = this.houseData?.homeConsumption || 0;

    // Optimized: more exporting, less importing
    if (solar > consumption + 0.5) {
      return 'exporting';
    } else if (consumption > solar + 2) {
      return 'importing';
    }
    return 'idle';
  }

  private generateCurrentEnergyFlows(): EnergyFlow[] {
    // Suboptimal energy flows
    const flows: EnergyFlow[] = [];

    if (this.houseData.solarProduction > 0) {
      flows.push({
        from: 'solar',
        to: 'home',
        amount: Math.min(this.houseData.solarProduction, this.houseData.homeConsumption),
        isActive: true
      });
    }

    if (this.houseData.batteryStatus === 'charging') {
      flows.push({
        from: 'solar',
        to: 'battery',
        amount: 2.5,
        isActive: true
      });
    } else if (this.houseData.batteryStatus === 'discharging') {
      flows.push({
        from: 'battery',
        to: 'home',
        amount: 1.8,
        isActive: true
      });
    }

    if (this.houseData.gridConnection === 'exporting') {
      flows.push({
        from: 'solar',
        to: 'grid',
        amount: 2.2,
        isActive: true
      });
    } else if (this.houseData.gridConnection === 'importing') {
      flows.push({
        from: 'grid',
        to: 'home',
        amount: 2.1,
        isActive: true
      });
    }

    return flows;
  }

  private generateOptimizedEnergyFlows(): EnergyFlow[] {
    // Optimized energy flows - more efficient
    const flows: EnergyFlow[] = [];

    if (this.houseData.solarProduction > 0) {
      flows.push({
        from: 'solar',
        to: 'home',
        amount: Math.min(this.houseData.solarProduction, this.houseData.homeConsumption),
        isActive: true
      });
    }

    if (this.houseData.batteryStatus === 'charging') {
      flows.push({
        from: 'solar',
        to: 'battery',
        amount: 3.5, // More efficient charging
        isActive: true
      });
    } else if (this.houseData.batteryStatus === 'discharging') {
      flows.push({
        from: 'battery',
        to: 'home',
        amount: 2.8, // More efficient discharge
        isActive: true
      });
    }

    if (this.houseData.gridConnection === 'exporting') {
      flows.push({
        from: 'solar',
        to: 'grid',
        amount: 3.8, // More export
        isActive: true
      });
    } else if (this.houseData.gridConnection === 'importing') {
      flows.push({
        from: 'grid',
        to: 'home',
        amount: 1.2, // Less import
        isActive: true
      });
    }

    return flows;
  }

  getBatteryStatusColor(): string {
    if (this.isOptimized) {
      switch (this.houseData.batteryStatus) {
        case 'charging':
          return 'text-green-400';
        case 'discharging':
          return 'text-blue-400';
        default:
          return 'text-teal-400';
      }
    }

    switch (this.houseData.batteryStatus) {
      case 'charging':
        return 'text-green-400';
      case 'discharging':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  }

  getBatteryStatusIcon(): string {
    switch (this.houseData.batteryStatus) {
      case 'charging':
        return 'M5 10l7-7m0 0l7 7m-7-7v18';
      case 'discharging':
        return 'M19 14l-7 7m0 0l-7-7m7 7V3';
      default:
        return 'M20 12H4';
    }
  }

  getGridStatusColor(): string {
    if (this.isOptimized) {
      switch (this.houseData.gridConnection) {
        case 'exporting':
          return 'text-green-400';
        case 'importing':
          return 'text-yellow-400';
        default:
          return 'text-teal-400';
      }
    }

    switch (this.houseData.gridConnection) {
      case 'exporting':
        return 'text-green-400';
      case 'importing':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  }

  getHouseGlowClass(): string {
    if (this.isOptimized) {
      return 'optimized-house';
    } else if (this.isTransitioning) {
      return 'transitioning-house';
    }
    return '';
  }

  getFlowAnimation(): string {
    if (this.isOptimized) {
      return 'optimized-flow';
    } else if (this.isTransitioning) {
      return 'transitioning-flow';
    }
    return 'normal-flow';
  }

  getEnergyEfficiencyRating(): string {
    if (this.isOptimized) {
      return 'A+';
    }
    return 'C';
  }

  getEfficiencyColor(): string {
    if (this.isOptimized) {
      return 'text-green-400';
    }
    return 'text-orange-400';
  }

  trackByFlow(index: number, flow: EnergyFlow): string {
    return `${flow.from}-${flow.to}`;
  }
}
