export const entryAmountsToCircleInputModel = function (entry) {
  return {
    red: entry.amountRed,
    amber: entry.amountAmber,
    green: entry.amountGreen,
  }
}

export const circleInputModelToEntryAmounts = function (model) {
  return {
    amountRed: model.red,
    amountAmber: model.amber,
    amountGreen: model.green,
  }
}
