import ServiceCard from "./ServiceCard";

const ServiceGrid = ({ services, className }) => {
  // remove the classname parameter when the testing UI has been verified by the client
  return (
    <div className={`gap-8 grid ${className}`}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};

export default ServiceGrid;
