function ScaleBalancing(strArr) {
  let isSolutionFound = false;
  const weights = strArr[0]
    .replace("[", "")
    .replace("]", "")
    .split(",")
    .map(Number);
  const counterWeights = strArr[1]
    .replace("[", "")
    .replace("]", "")
    .split(",")
    .map(Number);
  let filteredArray = [];
  // We need to filter out our weights list on the wieght being considered
  const customFilter = (currentWeight) => {
    filteredArray.push(currentWeight);
  };
  for (let i = 0; i < counterWeights.length; i++) {
    const currentWeight = counterWeights[i];
    const calculateDiff = () => {
      return weights[1] - (weights[0] + currentWeight);
    };
    // calculate if balance will be found here
    filteredArray = [];
    isSolutionFound = false; // sets it back to false at beginning
    // nested for loop, unsure if needed
    let weightsToAdd = [];
    let solutionsFound = counterWeights.slice();
    const diffsToCheck = solutionsFound.map((weight) => {
      return calculateDiff(weight);
    });
    const uniqueDiffs = Diffs(diffsToCheck);
    for (let d of uniqueDiffs) {
      if (Math.abs(d) <= Math.max(...solutionsFound)) {
        weightsToAdd.push(solutionsFound[diffsToCheck.indexOf(d)]);
        filteredArray.push(currentWeight);
      }
    }
    function Diffs(arr) {
      return arr.filter((val, idx) => {
        return arr.indexOf(val) === idx;
      });
    }
    if (weightsToAdd.length > 0) {
      isSolutionFound = true;
      return weightsToAdd.map((weight) => customFilter(weight)).join(",");
    }
  }
  return "not possible";
}
