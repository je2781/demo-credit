import ejs from "ejs";
import fs from "fs";
import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";
import path from "path";

const homeFilePath = path.resolve(__dirname, "../../build/views/home_mock.ejs");

describe("Home page", () => {
    let dom: JSDOM;
    let container: HTMLElement;
  
    // Define your dynamic data
    const dynamicData = {
      isAuthenticated: true,
      Msg: null,
      env: 'testing',
      docTitle: 'Profile',
      path: '/logout',
      email: 'test@test.com',
      url: 'src/public/images/test.png',
      balance: '478',
      userName: 'testuser'
    };
    
  
    beforeAll((done) => {
      fs.readFile(homeFilePath, "utf8", (err, template) => {
        if (err) {
          return done(err);
        }
  
        // Render the EJS template with the dynamic data
        const renderedHtml = ejs.render(template, dynamicData);
        dom = new JSDOM(renderedHtml, { runScripts: "dangerously" });
        container = dom.window.document.body;
  
        done();
      });
    });
  
    test("should load user profile", () => {
      // Check if container is defined before using querySelector
      expect(container).toBeDefined();
  
      expect(container.querySelector(".profile-image")).toBeInTheDocument();
      expect(container.querySelector(".profile-title")).toBeInTheDocument();
      expect(container.querySelector(".fa-solid.fa-wallet")).toBeInTheDocument();
      expect(container.querySelector(".fa-solid.fa-envelope")).toBeInTheDocument();
  
    });
  });