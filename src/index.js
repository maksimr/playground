function main() {
  setTimeout(function ping() {
    console.warn('ping', new Date());
    setTimeout(ping, 10);
  }, 10);
}

main();