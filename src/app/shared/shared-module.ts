import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCard } from './components/metric-card/metric-card';
import { ChartContainer } from './components/chart-container/chart-container';
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';
import { Button } from './components/button/button';
import { EnergyFormatPipe } from './pipes/energy-format-pipe';
import { CurrencyFormatPipe } from './pipes/currency-format-pipe';
import { ThemeToggle } from './components/theme-toggle/theme-toggle';



@NgModule({
  declarations: [
    MetricCard,
    ChartContainer,
    LoadingSpinner,
    Button,
    EnergyFormatPipe,
    CurrencyFormatPipe,
    ThemeToggle
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MetricCard,
    ThemeToggle
  ]
})
export class SharedModule { }
