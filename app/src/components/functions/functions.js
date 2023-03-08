export function chatHandler() {
  const historyDates = (messages) => {
    let dates = messages.map(
      (el) => new Date(el.date).toISOString().split("T")[0]
    ); //to get an array of  message dates
    let noDuplicate = dates.filter(
      (item, index) => dates.indexOf(item) === index
    ); //remove duplicate dates
    return noDuplicate;
  };

  return {
    historyDates,
  };
}
