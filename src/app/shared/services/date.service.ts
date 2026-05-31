import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  public calculateRevisionDate(releaseDate: string | null | undefined): string {
    if (!releaseDate) {
      return '';
    }

    try {
      const date = new Date(releaseDate);
      const revisionDate = new Date(date);
      revisionDate.setFullYear(revisionDate.getFullYear() + 1);

      return revisionDate.toISOString().slice(0, 10);
    } catch {
      return '';
    }
  }

  public isDateTodayOrInFuture(dateString: string | null | undefined): boolean {
    if (!dateString) {
      return false;
    }
    try {
      const inputDate = new Date(dateString);
      if (Number.isNaN(inputDate.getTime())) {
        return false;
      }

      const inputDateStr = inputDate.toISOString().slice(0, 10);
      const todayStr = new Date().toISOString().slice(0, 10);

      return inputDateStr >= todayStr;
    } catch {
      return false;
    }
  }

  public formatDate(dateString: string, locale: string = 'es-ES'): string {
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }
}
