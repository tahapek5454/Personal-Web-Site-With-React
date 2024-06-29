import React from "react";
import personAbout from "../../images/tahaAboutImage.jpeg";
import csharpIcon from "../../images/csharp.png";
import kubernetesIcon from "../../images/kubernetes-icon.png"
import "./CustomAbout.css";

function CustomAbout() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 bg-black" id="custom-about">
        <div className="container flex flex-col-reverse lg:flex-row  md:space-x-8  ">
          <div className="basis-1/3 px-4 md:px-0">
            <img
              src={personAbout}
              alt="Person"
              className="rounded-xl hover:scale-110 hover:opacity-50 duration-500"
            />
          </div>

          <div className="basis-2/3 px-2 md:px-0">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl md:text-5xl text-gega-red tracking-wider">
                HAKKIMDA
              </h2>          
            </div>

            <div className="flex flex-col items-center justify-center mt-2 group">
              <ul className="list-none text-sm md:text-lg text-gega-grey font-open">
                <li className="mt-4 group-hover:mt-6 duration-500 ">
                  Merhabalar, ben Taha Pek.
                </li>
                <li className="mt-4 group-hover:mt-6 duration-500 ">
                  09.08.2002 Sakarya' da doğdum.
                </li>
                <li className="mt-4 group-hover:mt-6 duration-500 ">
                  Kocaeli Üniversitesi Bilgisayar Mühendisliği mezunuyum.
                </li>
                <li className="mt-4 group-hover:mt-6 duration-500 ">
                  Aktif olarak Doğuş Teknoloji şirketinde Software Developer olarak görev almaktayım.
                </li>
                <li className="mt-4 group-hover:mt-6 duration-500 max-w-[70ch] ">
                  Dinamik ve sonuç odaklı bir yazılım geliştirici olarak, hem backend hem de frontend alanlarında deneyime sahibiyim.
                </li>
                <li className="mt-4 group-hover:mt-6 duration-500 max-w-[70ch] ">
                  Projelerimi bulut tabanlı ortamlara başarıyla entegre ederken, Kubernetes gibi containerization teknolojilerini etkin bir şekilde kullanıyorum.
                </li>
                <li className="mt-4 group-hover:mt-6 duration-500 max-w-[70ch] ">
                  CI/CD süreçlerini yöneterek, yazılım geliştirme yaşam döngüsünün her aşamasında verimliliği arttırıyorum.
                </li>
                <li className="mt-4 group-hover:mt-6 duration-500 max-w-[70ch] ">
                  DevOps prensiplerine olan ilgim sayesinde, geliştirme ve operasyon ekipleri arasında köprü kurarak, hızlı ve güvenilir teslimatlar gerçekleştiriyorum.
                </li>
                <li className="mt-4 group-hover:mt-6 duration-500 max-w-[70ch] ">
                  Agile prensiplerini benimseyerek, ekip çalışmasını ve esnekliği ön planda tutuyor, sürekli öğrenmeye ve yenilikçi çözümler geliştirmeye olan tutkumla, karmaşık problemleri çözmek için etkili yaklaşımlar geliştiriyorum.
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center mt-16 mb-16 md:mb-0 md:mt-28">
              <div className="w-128 overflow-x-auto custom-scrollbar">
                <ul className="flex">
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full p-2 h-full flex rounded-full text-center items-center bg-pek-grey justify-center">
                      <img src={csharpIcon} alt="" />
                    </div>
                  </li>
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full h-full flex rounded-full text-center items-center bg-gega-white justify-center">
                      <i className="fa-brands fa-js text-black text-6xl "></i>
                    </div>
                  </li>
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full h-full flex rounded-full text-center items-center bg-pek-grey justify-center">
                      <i className="fa-brands fa-java text-gega-white text-6xl "></i>
                    </div>
                  </li>
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full h-full flex rounded-full text-center items-center bg-gega-white justify-center">
                      <i className="fa-brands fa-react text-black text-6xl "></i>
                    </div>
                  </li>
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full h-full flex rounded-full text-center items-center bg-pek-grey justify-center">
                      <i className="fa-brands fa-angular text-gega-white text-6xl "></i>
                    </div>
                  </li>
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full h-full flex rounded-full text-center items-center bg-gega-white justify-center">
                      <i className="fa-brands fa-vuejs text-black text-6xl "></i>
                    </div>
                  </li>
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full h-full flex rounded-full text-center items-center bg-pek-grey justify-center">
                      <i className="fa-brands fa-html5 text-gega-white text-6xl "></i>
                    </div>
                  </li>
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full h-full flex rounded-full text-center items-center bg-gega-white justify-center">
                      <i className="fa-brands fa-css3-alt text-black text-6xl "></i>
                    </div>
                  </li>
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full h-full flex rounded-full text-center items-center bg-pek-grey justify-center">
                      <i className="fa-brands fa-python text-gega-white text-6xl "></i>
                    </div>
                  </li>
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full p-2 h-full flex rounded-full text-center items-center bg-gega-white justify-center">
                      <img src={kubernetesIcon} alt="" />
                    </div>
                  </li>
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full h-full flex rounded-full text-center items-center bg-pek-grey justify-center">
                      <i className="fa-solid fa-cloud text-gega-white text-6xl "></i>
                    </div>
                  </li>    
                  <li className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 m-5">
                    <div className="w-full h-full flex rounded-full text-center items-center bg-gega-white justify-center">
                      <i className="fa-brands fa-docker text-black text-6xl"></i>
                    </div>
                  </li> 
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CustomAbout;
