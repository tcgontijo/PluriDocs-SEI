const data = [
  {
    t1: "a",
    t2: "b"
  },
  {
    t1: "c",
    t2: "d"
  },
  {
    t1: "",
    t2: ""
  }
]

const dataFilter = data.filter(obj => Object.keys(obj).some(prop => obj[prop] !== ""));
console.log("😎 👉 dataFilter", dataFilter);

