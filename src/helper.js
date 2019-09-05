const formatDateToDate = (dateObject) => {
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const date = dateObject.getDate().toString().padStart(2, '0');

  return `${month}/${date}`;
};

const formatDateToTime = (dateObject) => {
  const hours = (dateObject.getHours() + 1).toString().padStart(2, '0');
  const minutes = dateObject.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};

export { formatDateToDate, formatDateToTime };
