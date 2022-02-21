const wait = async (time: number) => {
  return await new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const applyToAll = async <T, G>(
  list: T[],
  callback: (element: T, index?: number) => Promise<G>,
  sequential = false,
  standoff = 300,
): Promise<G[]> => {
  if (sequential) {
    const output: G[] = [];
    let index = -1;
    for (const element of list) {
      output.push(await callback(element, ++index));
    }
    return output;
  } else {
    return Promise.all(
      list.map(async (element, index) => {
        if (standoff != 0) {
          await wait(standoff * index);
        }
        return callback(element, index);
      }),
    );
  }
};
