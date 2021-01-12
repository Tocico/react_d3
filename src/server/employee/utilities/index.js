import ColorThief from "color-thief";

/* To get employee igame*/
const profileImageGetter = ({ firstName, lastName }) => {
  const imagePath = `img/employees/${[firstName, lastName]
    .join("_")
    .replace(/\s/g, "_")}.jpg`;
  return `${process.env.PUBLIC_URL}/${imagePath}`;
};

/* To get logo image */
const logoImageGetter = ({ client }) => {
  const imagePath = `img/logos/${client.trim().replace(/\s/g, "_")}.png`;

  return `${process.env.PUBLIC_URL}/${imagePath}`;
};

/* To get category image */
const categoryImageGetter = category => {
  const imagePath = `img/categories/${category
    .trim()
    .replace(/\s/g, "_")}.png`;

  return `${process.env.PUBLIC_URL}/${imagePath}`;
};

/* To get skills logo image */
const skillsLogoGetter = (src) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = `${process.env.PUBLIC_URL}${src}`;
  });
}

/* To get color */
const colorGetter = ( logoUrl ) => {
  return new Promise((resolve, reject) => {
    let colorThief = new ColorThief();
    let img = new Image();
    img.src = logoUrl;
    img.onload = () => {
      let dominantColor = colorThief.getColor(img);
      dominantColor = dominantColor.map(x => {
        x = parseInt(x).toString(16);
        return (x.length === 1) ? '0' + x : x;
      });
      resolve(`#${dominantColor.join('')}`);
    };
    img.onerror = () => reject('#3E5641');
  });
}



export {
  profileImageGetter,
  logoImageGetter,
  categoryImageGetter,
  skillsLogoGetter,
  colorGetter
};
