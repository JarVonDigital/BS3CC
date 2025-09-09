import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { bibleReadingResolver } from './bible-reading-resolver';

describe('bibleReadingResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => bibleReadingResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
