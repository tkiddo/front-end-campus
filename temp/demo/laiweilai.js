/*
 * @Author: 唐凯强
 * @Date: 2021-01-22 20:06:17
 * @LastEditors: 唐凯强
 * @LastEditTime: 2021-01-22 20:22:30
 * @Description:
 */

// 下划线转小驼峰

function convert(object) {
  if (Array.isArray(object)) {
    object = object.map((item) => {
      return convert(item);
    });
  } else {
    Object.keys(object).forEach((key) => {
      const arr = key.split('_');
      let newKey = arr[0];
      for (let i = 0; i < arr.length; i++) {
        newKey += arr[i][0].toUpperCase() + arr[i].substr(1);
      }
      object[newKey] = convert(object[key]);
      delete object[key];
    });
  }
  return object;
}

const origin = {
  a_bdas: {
    ds_gsd_sda: [
      {
        sd_gdssd_fds: 124
      }
    ]
  }
};

console.log(JSON.stringify(convert(origin)));
