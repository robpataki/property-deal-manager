import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimLink'
})
export class TrimLinkPipe implements PipeTransform {

  transform(link: string): string {
    if (!link || !link.length) {
      return link;
    }

    const regEx = new RegExp('(?:https?:\/\/)?(?:www\.)?', 'i');
    let trimmedLink = link.replace(regEx, '');
    return trimmedLink;
  }

}
