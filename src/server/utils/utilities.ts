const pause = async (time: number) => {
  return await new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const applyToAll = async (array: any, cb: any, isAsync = true, pauseTime = 0) => {
  if (isAsync) {
    return await Promise.all(
      array.map(async (el: any, index: number) => {
        await cb(el, index);
        await pause(pauseTime);
      }),
    );
  } else {
    const arr = [];
    for (let i = 0; i < array.length; i++) {
      arr.push(await cb(array[i], i));
    }

    return arr;
  }
};
