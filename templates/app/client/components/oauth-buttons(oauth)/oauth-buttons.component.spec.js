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
        // de = fixture.debugElement.query(By.css('a'));
        // el = de.nativeElement;
    });

    <%_ if(filters.googleAuth) { -%>
    it('should have a Google+ button', () => {
      const a = fixture.debugElement.query(By.css('i.fa-google-plus')).parent.nativeElement;

      fixture.detectChanges();

      <%_ if (filters.jasmine) { -%>
      expect(a.textContent).toContain('Connect with Google+');
      <%_ } if (filters.mocha) { -%>
      <%= expect() %>a.textContent<%= to() %>.contain('Connect with Google+');
      <%_ } -%>
    });
    <%_ } -%>

    // it('should contain anchor buttons', function() {
    //   compileDirective('<oauth-buttons></oauth-buttons>');
    //   expect($(element[0]).find('a.btn.btn-social').length).to.be.at.least(1);
    // });
    //
    // it('should evaluate and bind the classes attribute to scope.classes', function() {
    //   parentScope.scopedClass = 'scopedClass1';
    //   compileDirective('<oauth-buttons classes="testClass1 {{scopedClass}}"></oauth-buttons>');
    //   expect(elementScope.classes).to.equal('testClass1 scopedClass1');
    // });
    //
    // it('should bind scope.classes to class names on the anchor buttons', function() {
    //   compileDirective('<oauth-buttons></oauth-buttons>');
    //   // Add classes
    //   elementScope.classes = 'testClass1 testClass2';
    //   elementScope.$digest();
    //   expect($(element[0]).find('a.btn.btn-social.testClass1.testClass2').length).to.be.at.least(1);
    //
    //   // Remove classes
    //   elementScope.classes = '';
    //   elementScope.$digest();
    //   expect($(element[0]).find('a.btn.btn-social.testClass1.testClass2').length).to.equal(0);
    // });
});
