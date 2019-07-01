/* Copyright (c) 2018, RTE (http://www.rte-france.com)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAheadSettingsComponent } from './type-ahead-settings.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Store} from "@ngrx/store";
import {TextSettingComponent} from "../text-setting/text-setting.component";
import createSpyObj = jasmine.createSpyObj;
import {TypeaheadModule} from "ngx-type-ahead";
import {AppState} from "@ofStore/index";
import {authInitialState} from "@ofStates/authentication.state";
import {configInitialState} from "@ofStates/config.state";
import SpyObj = jasmine.SpyObj;
import {of} from "rxjs";
import {settingsInitialState} from "@ofStates/settings.state";
import {map} from "rxjs/operators";
import {PatchSettings} from "@ofActions/settings.actions";

describe('TypeAheadSettingsComponent', () => {
  let component: TypeAheadSettingsComponent;
  let fixture: ComponentFixture<TypeAheadSettingsComponent>;
  let store:SpyObj<Store<AppState>>;
    let emptyAppState: AppState = {
        router: null,
        feed: null,
        timeline: null,
        authentication: {...authInitialState, identifier: 'test'},
        card: null,
        menu: null,
        config: configInitialState,
        settings: null,
        time:null
    };

  beforeEach(async(() => {
    const storeSpy = createSpyObj('Store', ['dispatch', 'select']);
    TestBed.configureTestingModule({
        imports: [
            FormsModule,
            ReactiveFormsModule,
            TypeaheadModule
        ],
        providers:[{provide: Store, useValue: storeSpy}],
        declarations: [TypeAheadSettingsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      store = TestBed.get(Store);
      store.select.and.callFake(selector=>{
          return of({
              ...emptyAppState, settings: {
                  ...settingsInitialState,
                  loaded: true,
                  settings: {
                      test: 'old-value',
                      empty: null
                  }
              }
          }).pipe(
              map(v => selector(v))
          )
      });
    fixture = TestBed.createComponent(TypeAheadSettingsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
      fixture.detectChanges();
    expect(component).toBeTruthy();
  });

    it('should submit', (done) => {
        component.settingPath = 'empty';
        fixture.detectChanges();
        component.form.get('setting').setValue(['A','B']);
        setTimeout(()=> {
            expect(component.form.valid).toBeTruthy();
            expect(store.dispatch).toHaveBeenCalledTimes(1);
            const settings = {login:'test'};
            settings[component.settingPath] = ['A','B'];
            expect(store.dispatch).toHaveBeenCalledWith(new PatchSettings({settings: settings}));
            done();
        },1000);

    });

    it('should submit if requierd', (done) => {
        component.settingPath = 'empty';
        component.requiredField = true;
        fixture.detectChanges();
        component.form.get('setting').setValue(['A','B']);
        setTimeout(()=> {
            expect(component.form.valid).toBeTruthy();
            expect(store.dispatch).toHaveBeenCalledTimes(1);
            const settings = {login:'test'};
            settings[component.settingPath] = ['A','B'];
            expect(store.dispatch).toHaveBeenCalledWith(new PatchSettings({settings: settings}));
            done();
        },1000);

    });
    it('should not submit if required', (done) => {
        component.settingPath = 'empty';
        component.requiredField = true;
        fixture.detectChanges();
        component.form.get('setting').setValue(null);
        setTimeout(()=> {
            expect(component.form.valid).toBeFalsy();
            expect(store.dispatch).toHaveBeenCalledTimes(0);
            done();
        },1000);

    });
});