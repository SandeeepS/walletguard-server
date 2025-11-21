
// function for converting rupees into paisa for storing in the database 
export function toPaise(rupees: number) {
  return Math.round(rupees * 100);
}