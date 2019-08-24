import { fromPromise } from 'rxjs/internal-compatibility';


function main() {
  const url = (window.location.search.substr(1) || 'https://youtrack.jetbrains.com');

  fromPromise(fetch(url + '/api/config').then(response => response.json()))
    .subscribe((data) => {
      console.log(data);
    });
}


main();
