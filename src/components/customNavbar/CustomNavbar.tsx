import React, { useEffect, useState } from "react";

import "./CustomNavbar.css";

interface ICustomSection {
  key: string;
  start: number;
  end: number;
  index: number;
}

function CustomNavbar() {
  const [isExpand, setExpand] = useState<boolean>(false);
  const [navItemIndex, setNavItemIndex] = useState<number>(0);

  useEffect(() => {
    const getSections = () => {
      const sections: Partial<ICustomSection>[] = [];

      const sectionElements = document.querySelectorAll("section");
      const sectionsArray = Array.from(sectionElements);

      sectionsArray.forEach((section) => {
        const rect = section.getBoundingClientRect();
        sections.push({
          index: idFilter(section.id),
          key: section.id,
          start: rect.top + window.scrollY,
          end: rect.bottom + window.scrollY
        });
      });

      return sections;
    };

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const customSections = getSections();

      customSections.forEach((section) => {
        if (
          currentScrollPos >= (section.start as number) &&
          currentScrollPos < (section.end as number)
        )
          setNavItemIndex(section.index as number);
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navItemIndex]);

  const idFilter = (id: string) => {
    if (id === "custom-about") return 1;
    if (id === "custom-ex") return 2;
    if (id === "custom-project") return 3;
    if (id === "custom-footer") return 4;
  };

  const scrollToElement = (id: string) => {
    const container = document.getElementById(id);
    container?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-col sticky top-0 z-50">
        <header className="bg-black py-4 text-gega-grey font-gemunu">
          <div className="container md:flex md:items-center justify-between space-x-8 lg:space-x-16">
            <span
              onClick={() => {
                scrollToElement("project-body");
                setNavItemIndex(0);
              }}
              className="pl-7 md:pl-0 text-3xl lg:text-5xl font-bold text-transparent bg-gradient-to-r bg-clip-text from-gega-red to-gega-grey whitespace-nowrap hover:cursor-pointer"
            >
              TAHA PEK
            </span>

            <div
              className="flex absolute right-1 items-center top-6 pr-7 md:hidden"
              onClick={() => setExpand(!isExpand)}
            >
              <div className="space-y-1 cursor-pointer">
                <div className="bg-gega-grey w-8 h-1 rounded-full"></div>
                <div className="bg-gega-grey w-8 h-1 rounded-full"></div>
                <div className="bg-gega-grey w-8 h-1 rounded-full"></div>
              </div>
            </div>

            <nav className={`hidden md:flex md:justify-between flex-1`}>
              <div></div>

              <ul className="flex items-center space-x-6  lg:space-x-8 lg:text-lg ">
                <li>
                  <span
                    onClick={() => {
                      scrollToElement("custom-about");
                      setNavItemIndex(1);
                    }}
                    className={`${
                      navItemIndex === 1 ? "active " : ""
                    } hover:text-gega-melon transition duration-500 hover:cursor-pointer`}
                  >
                    HAKKIMDA
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => {
                      scrollToElement("custom-ex");
                      setNavItemIndex(2);
                    }}
                    className={`${
                      navItemIndex === 2 ? "active " : ""
                    } hover:text-gega-melon transition duration-500 hover:cursor-pointer`}
                  >
                    TECRÜBELERİM
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => {
                      scrollToElement("custom-project");
                      setNavItemIndex(3);
                    }}
                    className={`${
                      navItemIndex === 3 ? "active " : ""
                    } hover:text-gega-melon transition duration-500 hover:cursor-pointer`}
                  >
                    PROJELER
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => {
                      scrollToElement("custom-footer");
                      setNavItemIndex(4);
                    }}
                    className={`${
                      navItemIndex === 4 ? "active " : ""
                    } hover:text-gega-melon transition duration-500 hover:cursor-pointer`}
                  >
                    İLETİŞİM
                  </span>
                </li>
              </ul>

              <div className="flex justify-center space-x-7">
                <div className="flex justify-start space-x-6">
                  <a
                    href="https://github.com/tahapek5454"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-brands fa-github text-gega-grey text-3xl"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/tahapek"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-brands fa-instagram  text-gega-grey text-3xl"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/taha-pek-413b1b221"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-brands fa-linkedin  text-gega-grey text-3xl"></i>
                  </a>
                </div>
                <a
                  href="https://drive.google.com/file/d/1XsLJrYgkEJFZwcbXQA3dGIHbc-o-rNHS/view?usp=share_link"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 md:mt-0 bg-gega-red px-3 py-1 hover:bg-rose-600 transation duration-500 rounded-full "
                >
                  CV <i className="fa-solid fa-download text-gega-grey"></i>
                </a>
              </div>
            </nav>
          </div>
        </header>

        <div
          className={`${
            isExpand
              ? "pl-7 bg-black py-4 text-gega-grey font-gemunu flex flex-col justify-between"
              : "hidden"
          }  md:hidden`}
        >
          <div className="bg-gega-grey w-11/12 h-1 rounded-full mb-3 navAnimation"></div>
          <ul className="space-y-4  items-center navAnimation">
            <li>
              <span
                onClick={() => {
                  scrollToElement("custom-about");
                  setNavItemIndex(1);
                }}
                className={`${
                  navItemIndex === 1 ? "active " : ""
                } hover:text-gega-melon transition duration-500 hover:cursor-pointer`}
              >
                HAKKIMDA
              </span>
            </li>
            <li>
              <span
                onClick={() => {
                  scrollToElement("custom-ex");
                  setNavItemIndex(2);
                }}
                className={`${
                  navItemIndex === 2 ? "active " : ""
                } hover:text-gega-melon transition duration-500 hover:cursor-pointer`}
              >
                TECRÜBELERİM
              </span>
            </li>
            <li>
              <span
                onClick={() => {
                  scrollToElement("custom-project");
                  setNavItemIndex(3);
                }}
                className={`${
                  navItemIndex === 3 ? "active " : ""
                } hover:text-gega-melon transition duration-500 hover:cursor-pointer`}
              >
                PROJELER
              </span>
            </li>
            <li>
              <span
                onClick={() => {
                  scrollToElement("custom-footer");
                  setNavItemIndex(4);
                }}
                className={`${
                  navItemIndex === 4 ? "active " : ""
                } hover:text-gega-melon transition duration-500 hover:cursor-pointer`}
              >
                İLETİŞİM
              </span>
            </li>
          </ul>

          <div className="flex justify-start space-x-5 my-3 navAnimation">
            <a
              href="https://github.com/tahapek5454"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-github text-gega-grey text-3xl"></i>
            </a>
            <a
              href="https://www.instagram.com/tahapek"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-instagram  text-gega-grey text-3xl"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/taha-pek-413b1b221"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-linkedin  text-gega-grey text-3xl"></i>
            </a>
          </div>

          <a
            href="https://drive.google.com/file/d/1XsLJrYgkEJFZwcbXQA3dGIHbc-o-rNHS/view?usp=share_link"
            target="_blank"
            rel="noreferrer"
            className="navAnimation bg-gega-red hover:bg-rose-600 transation duration-500 rounded-full w-16 h-10 text-gega-grey flex justify-center items-center"
          >
            <span>CV</span> <i className="fa-solid fa-download "></i>
          </a>
        </div>
      </div>
    </>
  );
}

export default CustomNavbar;
