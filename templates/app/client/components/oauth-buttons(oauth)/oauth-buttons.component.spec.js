'use strict';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OauthButtonsComponent } from './oauth-buttons.component';

describe('Component: OauthButtonsComponent', () => {
    let comp: OauthButtonsComponent;
    let fixture: ComponentFixture<BannerComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ OauthButtonsComponent ], // declare the test component
        });

        fixture = TestBed.createComponent(OauthButtonsComponent);

        comp = fixture.componentInstance; // OauthButtonsComponent test instance

        // query for the title <h1> by CSS element selector
        de = fixture.debugElement.query(By.css('a'));
        el = de.nativeElement;
    });

    it('test', () => {
        console.log(fixture.debugElement.query(By.css('i.fa-google-plus')));
        fixture.detectChanges();
        <%_ if (filters.jasmine) { -%>
        expect(el.textContent).toContain('Connect with Google+');
        <%_ } if (filters.mocha) { -%>
        <%= expect() %>el.textContent<%= to() %>.contain('Connect with Google+');
        <%_ } -%>
    });
});
