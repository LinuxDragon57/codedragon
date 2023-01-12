function getCurrentYear() {
    return document.getElementById("year").innerHTML = new Date().getFullYear().toString();
}
function main() {
    getCurrentYear();
    return 0;
}
main();
