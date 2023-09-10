import React from "react";

function CustomFooter() {
  const scrollToElement = (id: string) => {
    const container = document.getElementById(id);
    container?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-black text-gega-grey" id="custom-footer">
        <div className="container flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 p-4">
          <span
            onClick={() => scrollToElement("project-body")}
            className="text-xl lg:text-2xl font-bold text-transparent bg-gradient-to-r bg-clip-text from-gega-red to-gega-grey whitespace-nowrap hover:cursor-pointer"
          >
            TAHA PEK
          </span>

          <div className="grid grid-cols-3 gap-6">
            <a
              href="https://github.com/tahapek5454"
              target="_blank"
              rel="noreferrer"
              className="col-span-1"
            >
              <i className="fa-brands fa-github text-gega-grey text-3xl"></i>
            </a>
            <a
              href="https://www.instagram.com/tahapek"
              target="_blank"
              rel="noreferrer"
              className="col-span-1"
            >
              <i className="fa-brands fa-instagram  text-gega-grey text-3xl"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/taha-pek-413b1b221"
              target="_blank"
              rel="noreferrer"
              className="col-span-1"
            >
              <i className="fa-brands fa-linkedin  text-gega-grey text-3xl"></i>
            </a>
          </div>

          <div>
            <h2 className="text-gega-red hidden md:flex"> İLETİŞİM</h2>
            <span className="text-xl">tahapek5454@gmail.com</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default CustomFooter;
