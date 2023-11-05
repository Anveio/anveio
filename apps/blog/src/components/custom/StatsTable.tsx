import * as React from "react";

export const StatsTable = () => {
  return (
    <div className="flex items-center justify-stretch ">
      <table className="table-auto border-collapse border border-gray-700 text-left text-white w-full">
        <caption className="text-lg mb-4 font-semibold text-gray-300">
          Reports of the Advisory Panels for the Fourth Five Year Plan 1970–75,
          Vol. I, published by the planning commission of Pakistan.
        </caption>
        <thead>
          <tr>
            <th className="text-lg border border-gray-700 p-3">Year</th>
            <th className="border border-gray-700 p-3">
              Spending on West Pakistan (in millions of Pakistani rupees)
            </th>
            <th className="border border-gray-700 p-3">
              Spending on East Pakistan (in millions of Pakistani rupees)
            </th>
            <th className="border border-gray-700 p-3">
              Amount spent on East as percentage of West
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-700 p-2">1950–55</td>
            <td className="border border-gray-700 p-2">11,290</td>
            <td className="border border-gray-700 p-2">5,240</td>
            <td className="border border-gray-700 p-2">46.4%</td>
          </tr>
          <tr className="bg-gray-800">
            <td className="border border-gray-700 p-2">1955–60</td>
            <td className="border border-gray-700 p-2">16,550</td>
            <td className="border border-gray-700 p-2">5,240</td>
            <td className="border border-gray-700 p-2">31.7%</td>
          </tr>
          <tr>
            <td className="border border-gray-700 p-2">1960–65</td>
            <td className="border border-gray-700 p-2">33,550</td>
            <td className="border border-gray-700 p-2">14,040</td>
            <td className="border border-gray-700 p-2">41.8%</td>
          </tr>
          <tr className="bg-gray-800">
            <td className="border border-gray-700 p-2">1965–70</td>
            <td className="border border-gray-700 p-2">51,950</td>
            <td className="border border-gray-700 p-2">21,410</td>
            <td className="border border-gray-700 p-2">41.2%</td>
          </tr>
          <tr>
            <td className="border border-gray-700 p-2 font-semibold">Total</td>
            <td className="border border-gray-700 p-2 font-semibold">
              113,340
            </td>
            <td className="border border-gray-700 p-2 font-semibold">45,930</td>
            <td className="border border-gray-700 p-2 font-semibold">40.5%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
