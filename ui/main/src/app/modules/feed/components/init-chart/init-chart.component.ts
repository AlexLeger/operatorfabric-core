import { Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '@ofStore/index';
import * as timelineSelectors from '@ofSelectors/timeline.selectors';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'of-init-chart',
  templateUrl: './init-chart.component.html',
  styleUrls: ['./init-chart.component.scss']
})
export class InitChartComponent implements OnInit {
  @Input() conf;
  @Input() confZoom;

  // required by Timeline
  public arrayChartData: any[];
  public myDomain: number[];
  data$: Observable<any[]>;

  // options of Timeline
  public enableDrag: boolean;
  public enableZoom: boolean;
  public autoScale: boolean;
  public animations: boolean;
  public showGridLines: boolean;
  public realTimeBar: boolean;
  public centeredOnTicks: boolean;
  public circleDiameter: number;

  // required for domain movements specifications
  private realCaseActivate: boolean;
  private continuousForward: number;

  // buttons
  public forwardButtonType: string;
  public zoomButtonsActive: boolean;
  public buttonHome: number[];
  public buttonHomeActive: boolean;
  public buttonList;
  private buttonListWidth: number;


  constructor(private store: Store<AppState>) {
    this.buttonHome = undefined;
    this.buttonHomeActive = false;
    this.buttonList = undefined;
    this.buttonListWidth = 0;
    this.zoomButtonsActive = false;
    this.forwardButtonType = undefined;
    this.realCaseActivate = true;
    this.continuousForward = 0;

    // options
    this.myDomain = undefined;
    this.enableDrag = false;
    this.enableZoom = false;
    this.autoScale = false;
    this.animations = false;
    this.showGridLines = false;
    this.centeredOnTicks = false;
    this.realTimeBar = false;
    this.circleDiameter = 10;
  }


  /**
   * set selector on timeline's State
   * and call timeline initialization functions
   */
  ngOnInit() {
    // init data selector
    this.data$ = this.store.pipe(
        select(timelineSelectors.selectTimelineSelection),
        catchError(err => of([]))
    );
    this.confContextGraph();
    this.setChartData();
  }

  /**
   * subscribe on timeline's State data
   * feed arrayChartData with values from data Observable
   */
  setChartData(): void {
    this.data$.subscribe(value => {
      const chartData = value.map(d => d);
      this.setArrayChartData(chartData);
    });
  }

  /**
   * sort by date the array received on param
   * set an list of arrays for each severity of Cards
   */
  setArrayChartData(array: any[]): void {
    array.sort((val1, val2) => { return val1.date - val2.date; });

    const arraySeverity = [];
    this.arrayChartData = [];
    for (const value of array) {
      const obj = _.cloneDeep(value);
      obj.date = obj.startDate;
      obj.r = 20;
      obj.stroke = 'stroke';
      obj.count = 1;
      obj.color = this.getColorSeverity(obj.severity);
      obj.value = this.getCircleValue(obj.severity);

      // Set this.arrayChartData and arraySeverity
      if (this.arrayChartData === []) {
        this.arrayChartData.push([]);
        this.arrayChartData[0].push(obj);
        arraySeverity.push({color: obj.color, id: 0});
      } else {
        let idx = -1;
        for (let i = 0; i < arraySeverity.length; i++) {
          if (arraySeverity[i].color === obj.color) {
            idx = i;
            break;
          }
        }
        if (idx === -1) {
          const last = this.arrayChartData.length;
          this.arrayChartData.push([]);
          this.arrayChartData[last].push(obj);
          arraySeverity.push({color: obj.color, id: last});
        } else {
          this.arrayChartData[idx].push(obj);
        }
      }
    }
  }

  /**
   * return color according to severity
   * @param color
   */
  getColorSeverity(color: string): string {
    if (color) {
     switch (color) {
       case 'ALARM': {
         return 'red';
       }
       case 'ACTION': {
         return 'orange';
       }
       case 'QUESTION': {
         return 'green';
       }
       case 'NOTIFICATION': {
         return 'blue';
       }
       default : {
         return 'white';
       }
     }
    } else { // default
      return 'white';
    }
  }

  /**
   * return value (y position) according to severity
   * @param color
   */
  getCircleValue(color: string): number {
    if (color) {
     switch (color) {
       case 'ALARM': {
         return 4;
       }
       case 'ACTION': {
         return 3;
       }
       case 'QUESTION': {
         return 2;
       }
       case 'NOTIFICATION': {
         return 1;
       }
       default : {
         return 5;
       }
     }
    } else { // default
      return 5;
    }
  }

  /**
   * set timeline options from conf
   */
  readConf(): void {
    // Options on graph
    if (this.conf) {
      if (this.conf.enableDrag) {
        this.enableDrag = true;
      }
      if (this.conf.enableZoom) {
        this.enableZoom = true;
      }
      if (this.conf.autoScale) {
        this.autoScale = true;
      }
      if (this.conf.animations) {
        this.animations = true;
      }
      if (this.conf.showGridLines) {
        this.showGridLines = true;
      }
      if (this.conf.realTimeBar) {
        this.realTimeBar = true;
      }
      if (this.conf.centeredOnTicks) {
        this.centeredOnTicks = true;
      }
      if (this.conf.circleDiameter) {
        this.circleDiameter = this.conf.circleDiameter;
      }
    }
  }

  /**
   * timeline configuration make by calling readConf function
   * set domain context of timeline :
   * if it was given on confZoom, set the list of zoom buttons
   * else default zoom is weekly without selection
   */
  confContextGraph(): void {
    this.readConf();

    // Feed zoom buttons Array by the conf received
    this.buttonList = [];
    if (this.confZoom) {
      for (const elem of this.confZoom) {
        const tmp = _.cloneDeep(elem);
        this.buttonList.push(tmp);
      }
    } else {
      // Default domain set (week)
      this.forwardButtonType = 'W';
      this.zoomButtonsActive = true;
      const startDomain = moment();
      startDomain.startOf('week');
      startDomain.hours(0).minutes(0).seconds(0).millisecond(0);
      const endDomain = _.cloneDeep(startDomain);
      endDomain.add(7, 'days');
      this.setStartAndEndDomain(startDomain.valueOf(), endDomain.valueOf());
      this.buttonHome = [startDomain.valueOf(), endDomain.valueOf()];
    }
    // Set the zoom activate and assign the width of the buttons list on html
    if (this.buttonList.length > 0) {
      this.zoomButtonsActive = true;
      this.changeGraphConf(this.buttonList[0]);
    }
  }

  /**
   * desactive the home button and set his new field
   * set the zoom level type
   * change timeline domain
   * set all buttons selected property to false
   * select the button from the conf received
   * @param conf
   */
  changeGraphConf(conf: any): void {
    if (conf) {
      this.buttonHomeActive = false;
      this.realCaseActivate = true;
      this.continuousForward = 0;
      this.setStartAndEndDomain(conf.startDomain, conf.endDomain);
      if (conf.forwardLevel) {
        this.forwardButtonType = conf.forwardLevel;
      }
      this.buttonHome = [conf.startDomain, conf.endDomain];
      this.buttonList.forEach(button => {
        if (button.forwardLevel === conf.forwardLevel) {
          button.selected = true;
        } else {
          button.selected = false;
        }
      });
    }
  }

  /**
   * 2 cases :
   *  - apply arrow button clicked : switch the graph configuration with the zoom button configuration
   * at the left or right of our actual button selected
   *  - display home button
   * @param direction receive by child component custom-timeline-chart
   */
  applyNewZoom(direction: string): void {
    if (direction === 'in') {
      const reverseButtonList = _.cloneDeep(this.buttonList);
      reverseButtonList.reverse();
      for (let i = 0; i < reverseButtonList.length; i++) {
        if (reverseButtonList[i].forwardLevel === this.forwardButtonType) {
          if (i + 1 === reverseButtonList.length) {
            return;
          } else {
            this.changeGraphConf(reverseButtonList[i + 1]);
            return;
          }
        }
      }
    } else if (direction === 'out') {
      for (let i = 0; i < this.buttonList.length; i++) {
        if (this.buttonList[i].forwardLevel === this.forwardButtonType) {
          if (i + 1 === this.buttonList.length) {
            return;
          } else {
            this.changeGraphConf(this.buttonList[i + 1]);
            return;
          }
        }
      }
    } else { // Drag
      this.buttonHomeActive = true;
    }
  }

  /**
   * change timeline domain
   * desactive the home button display
   * @param startDomain
   * @param endDomain
   */
  homeClick(startDomain: number, endDomain: number): void {
    this.setStartAndEndDomain(startDomain, endDomain);
    this.buttonHomeActive = false;
  }

  /**
   * Apply new timeline domain
   * @param startDomain
   * @param endDomain
   */
  setStartAndEndDomain(startDomain: number, endDomain: number): void {
    const valueStart = startDomain;
    const valueEnd = endDomain;
    this.myDomain = [valueStart, valueEnd];
  }

  /**
   * select the movement apply on domain
   * only three set : Week, Month , Year
   * @param moveForward
   */
  moveDomain(moveForward: boolean): void {
    switch (this.forwardButtonType) {
      case 'W':
        this.moveDomainByWeek(moveForward);
        break;
      case 'D-7':
        this.moveDomainByDay(moveForward);
        break;
      case 'M':
        this.moveDomainByMonthOrYear(moveForward, 'months');
        break;
      case 'Y':
        this.moveDomainByMonthOrYear(moveForward, 'years');
        break;
    }
  }

  /**
   * define the actual week
   * move 7 days before or after the week selected
   * @param forward
   */
  moveDomainByWeek(forward: boolean): void {
    const startDomain = moment(this.myDomain[0]);
    startDomain.startOf('week');
    const endDomain = moment(startDomain);
    endDomain.add(7, 'days');
    if (forward) {
      startDomain.add(7, 'days');
      endDomain.add(7, 'days');
      this.myDomain = [startDomain.valueOf(), endDomain.valueOf()];
    } else {
      startDomain.subtract(7, 'days');
      endDomain.subtract(7, 'days');
      this.myDomain = [startDomain.valueOf(), endDomain.valueOf()];
    }
  }

 /**
   * define the actual week
   * add 1 day after the week selected
   * or move 1 day backward the week selected
   * @param forward
   */
  moveDomainByDay(forward: boolean): void {
    const startDomain = moment(this.myDomain[0]);
    const endDomain = moment(startDomain);
    endDomain.add(7, 'days');
    if (forward) {
      this.continuousForward++;
      // extend domain by one day
      if (this.continuousForward > 0) {
        endDomain.add(this.continuousForward, 'days');
      } else {
        // progress 1 day in time on the domain
        startDomain.add(1, 'days');
        endDomain.add(1, 'days');
      }
      this.myDomain = [startDomain.valueOf(), endDomain.valueOf()];
    } else {
      this.continuousForward--;
      // decrease domain by one day
      if (this.continuousForward > 0) {
        endDomain.add(this.continuousForward, 'days');
      } else {
        // move 1 day back in time on the domain
        startDomain.subtract(1, 'days');
        endDomain.subtract(1, 'days');
      }
      this.myDomain = [startDomain.valueOf(), endDomain.valueOf()];
    }
  }

  /**
   * define the actual unit received
   * move 1 unit before or after the unit selected
   * example of unit : months, years...
   * @param forward
   */
  moveDomainByMonthOrYear(forward: boolean, unit): void {
    const prevStartDomain = moment(this.myDomain[0]);
    const startDomain = _.cloneDeep(prevStartDomain);
    // For the first step, set to start of the month
    if (this.realCaseActivate) {
      startDomain.startOf(unit).hours(0);
      this.realCaseActivate = false;
    }
    const endDomain = _.cloneDeep(startDomain);
    if (forward) {
      startDomain.add(1, unit);
      endDomain.add(2, unit);
      this.myDomain = [startDomain.valueOf(), endDomain.valueOf()];
    } else {
      startDomain.subtract(1, unit);
      this.myDomain = [startDomain.valueOf(), endDomain.valueOf()];
    }
  }

  /**
   * return true for display home button
   */
  checkButtonHomeDisplay(): boolean {
    // buttonHomeActive = true when drag movement started
    if (this.buttonHomeActive) {
      return true;
    }
    // compare the actual domain with the domain of zoom selected
    if (this.buttonHome) {
      if (this.buttonHome[0] !== this.myDomain[0] || this.buttonHome[1] !== this.myDomain[1]) {
        return true;
      }
    }
    return false;
  }
}

