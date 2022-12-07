export default (weeksAgo = 0, now = new Date()) => {
  const week_comparison = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - weeksAgo * 7
  );

  let begin_time = new Date(),
    end_time = new Date();

  begin_time.setDate(week_comparison.getDate() - week_comparison.getDay());
  begin_time.setUTCHours(0, 0, 0, 0);
  end_time.setDate(begin_time.getDate() + 7);
  end_time.setUTCHours(23, 59, 59, 999);

  return {
    begin_time,
    end_time,
  };
};
