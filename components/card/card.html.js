export const CARD = ({ body = {}, className = "" } = {}) => {
  return {
    class: "card " + className,
    child: body,
  };
};
