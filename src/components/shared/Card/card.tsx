import Image from "next/image";
import Button from "../Button/button";

type CardProps = {
  image: string;
  title: string;
  description: string;
  price: string;
  buttonText: string;
};

const Card: React.FC<CardProps> = ({ image, title, description, price, buttonText }) => {
  return (
      <div className="flex flex-col items-center justify-center gap-4 p-4 bg-white shadow-lg rounded-lg">
        <Image src={image} alt={title} className="w-32 h-32 rounded-full" />
        <h2 className="text-title-lg font-semibold">{title}</h2>
        <p className="text-body-base text-center">{description}</p>
        <p className="text-title-lg font-semibold">{price}</p>
        <Button label={buttonText} />
      </div>
    );
  };
export default Card;
