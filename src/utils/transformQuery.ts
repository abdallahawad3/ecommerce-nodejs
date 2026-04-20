const transformQuery = (query: any) => {
  const result: any = {};

  for (let key in query) {
    if (key.includes("[")) {
      const [field, operator] = key.split(/\[|\]/).filter(Boolean);

      if (field && operator) {
        if (!result[field]) result[field] = {};

        // 👇 حط $ هنا وخلاص
        result[field][`$${operator}`] = query[key];
      }
    } else {
      result[key] = query[key];
    }
  }

  return result;
};

export default transformQuery;
