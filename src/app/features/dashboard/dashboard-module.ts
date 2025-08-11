import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { MetricsGrid } from './components/metrics-grid/metrics-grid';
import { HouseVisualization } from './components/house-visualization/house-visualization';
import { EnergyChart } from './components/energy-chart/energy-chart';
import { HeaderNav } from './components/header-nav/header-nav';
import { SharedModule } from '../../shared/shared-module';
import { OptimizationModule } from '../optimization/optimization-module';


@NgModule({
  declarations: [
    Dashboard,
    MetricsGrid,
    HouseVisualization,
    EnergyChart,
    HeaderNav
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    OptimizationModule
  ]
})
export class DashboardModule { }
