'use strict';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
<%_ if(filters.uirouter) { %>
import { UIRouterModule } from 'ui-router-ng2';<% } %>
<%_ if(filters.ngroute) { %>
import { RouterModule, Routes } from '@angular/router';<% } %>
<%_ if(filters.uibootstrap) { %>
import { TooltipModule } from 'ng2-bootstrap';<% } %>
<%_ if(filters.ws) { -%>
import { SocketService } from '../../components/socket/socket.service';
import { SocketMock } from '../../components/socket/socket.mock';<% } %>
import { MainComponent } from './main.component';

describe('Component: MainComponent', () => {
    let comp: MainComponent;
    let fixture: ComponentFixture<MainComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ MainComponent ], // declare the test component
            providers: [{
                provide: Http,
                useValue: Http
            }, {
                provide: SocketService,
                useValue: SocketMock
            }]
        });

        fixture = TestBed.createComponent(MainComponent);

        comp = fixture.componentInstance; // MainComponent test instance

        // query for the title <h1> by CSS element selector
        // de = fixture.debugElement.query(By.css('a'));
        // el = de.nativeElement;
    });

    it('should attach a list of things to the controller', function() {
        comp.ngOnInit();
        $httpBackend.flush();<% if (filters.jasmine) { %>
        expect(mainComponent.awesomeThings.length).toBe(4);<% } if (filters.mocha) { %>
        <%= expect() %>mainComponent.awesomeThings.length<%= to() %>.equal(4);<% } %>
    });
});
