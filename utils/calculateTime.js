import moment from "moment";
import Moment from "react-moment";

const calculateTime = (createdAt) => {
  const today = moment(Date.now());
  const postDate = moment(createdAt);
  const diffInH = today.diff(postDate, "hours");
  if (diffInH < 24) {
    return (
      <>
        Today <Moment format="hh:mm A">{createdAt}</Moment>
      </>
    );
  } else if (diffInH > 24 && diffInH < 36) {
    return (
      <>
        Yesterday <Moment format="hh:mm A">{createdAt}</Moment>
      </>
    );
  } else if (diffInH > 36) {
    return (
      <>
        <Moment format="DD/MM/YYYY hh:mm A">{createdAt}</Moment>
      </>
    );
  }
};

export default calculateTime;
