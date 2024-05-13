import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true
})
export class TimePipe implements PipeTransform {

  transform(minutes: number | undefined): string {
    let timeString = '';
    if (minutes) {
      const hours = Math.floor(minutes / 60);
      const remainderMinutes = minutes % 60;
      if (hours > 0) {
        timeString += `${hours} שעות`;
        if (remainderMinutes > 0) {
          timeString += ` ו- ${remainderMinutes} דקות`;
        }
      } else {
        timeString += `דקות ${remainderMinutes} `;
      }
    }

    return timeString;
  }

}
