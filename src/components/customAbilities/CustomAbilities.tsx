function CustomAbilities() {
  return (
    <>
      <section
        className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-800 via-gray-900 to-slate-800"
        id="custom-abilities"
      >
        <div className="container">
          <h2 className="text-center sm:text-left text-3xl md:text-5xl text-gega-red tracking-wider mb-12">
            KABİLİYETLER
          </h2>

          <div className="grid grid-cols-6 gap-10 text-gega-grey">
            <div className="col-span-6 lg:col-span-1 px-2 py-4 flex justify-center items-center  rounded-[10px] shadow-[16px_16px_20px_#000000] hover:scale-105 duration-500">
              <p className="text-sm md:text-xl text-center text-gega-grey ">
              WebAPI, MVC, C#, .NET/.NET Core frameworks deneyimi.
              </p>
            </div>
            <div className="col-span-6 lg:col-span-1 px-2 py-4 flex justify-center items-center rounded-[10px] shadow-[16px_16px_20px_#000000] text-sm md:text-xl text-center text-gega-grey hover:scale-105 duration-500">
                SOLID, Clean Code, Clean Architecuture, Microservice yaklaşımlarında bilgi sahibi.
            </div>
            <div className="col-span-6 lg:col-span-1 px-2 py-4 flex justify-center items-center rounded-[10px] shadow-[16px_16px_20px_#000000] text-sm md:text-xl text-center text-gega-grey hover:scale-105 duration-500">
                Docker, Kubernetes, RabbitMQ, ElasticSearch, MongoDB, PostgreSQL ... teknolojilerinde bilgi sahibi.
            </div>
            <div className="col-span-6 lg:col-span-1 px-2 py-4 flex justify-center items-center rounded-[10px] shadow-[16px_16px_20px_#000000] text-sm md:text-xl text-center text-gega-grey hover:scale-105 duration-500">
                Object-Oriented programlama ve Design Patterns hakimiyeti.
            </div>
            <div className="col-span-6 lg:col-span-1 px-2 py-4 flex justify-center items-center rounded-[10px] shadow-[16px_16px_20px_#000000] text-sm md:text-xl text-center text-gega-grey hover:scale-105 duration-500">
                Agile (Scrum) yazılım geliştirme metodolojilerinde deneyim sahibi.
            </div>
            <div className="col-span-6 lg:col-span-1 px-2 py-4 flex justify-center items-center  rounded-[10px] shadow-[16px_16px_20px_#000000] text-sm md:text-xl text-center text-gega-grey hover:scale-105 duration-500">
                C1 İngilizce seviyesi.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CustomAbilities;
