  import base_url from "./baseUrl";
  import CommonApi from "../Serveices/CommonApi";

  export const signupAPI=async(data)=>{
    return  await CommonApi(`${base_url}/api/auth/signup`,'POST',data,'')

  }
  export const signinAPI=async(data)=>{
        return await CommonApi(`${base_url}/api/auth/login`,'POST',data,'')
  }

  export const addTransactionAPI=async(data)=>{
  const token = sessionStorage.getItem("token")
      return await CommonApi(`${base_url}/api/transaction/add`,'POST',data,{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      })
  }
  export const getTransactionAPI = async () => {
    const token = sessionStorage.getItem("token")

    if (!token) {
      console.log("❌ No token found");
      return;
    }

    return await CommonApi(
      `${base_url}/api/transaction/get`,
      "GET",
      "",
      {
        "Authorization": `Bearer ${token}`
      }
    )
  }
  export const deleteTransactionAPI = async (id, token) => {
    return await fetch(`${base_url}/api/transaction/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };
  export const addBudgetAPI=async(data,token)=>{
    return await CommonApi(`${base_url}/api/budget/add`,'POST',data,{
      Authorization: `Bearer ${token}`
    })
  };
  export const getBudgetAPI=async(token)=>{
    return await CommonApi(`${base_url}/api/budget/get`,'GET',"",{
    Authorization: `Bearer ${token}`
    })
  }
  // AllApi.js
  export const deleteBudgetAPI = async (id, token) => {
    return await fetch(`${base_url}/api/budget/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  export const updateBudgetAPI = async (id, data, token) => {
    return await CommonApi(`${base_url}/api/budget/edit/${id}`, "PUT", data, {
      Authorization: `Bearer ${token}`
    });
  };
  export const addGoalAPI = async(data, token) =>{
    return await CommonApi(`${base_url}/api/goal/add`, "POST", data, {
      Authorization: `Bearer ${token}`
    });
  }
  export const getGoalAPI = async(token) =>{
  return await CommonApi(`${base_url}/api/goal/get`, "GET",undefined, {
      Authorization: `Bearer ${token}`
    });
  }
  export const addMoneyGoalAPI = async(id, data, token) =>{
  return await CommonApi(`${base_url}/api/goal/add-money/${id}`, "PUT", data, {
      Authorization: `Bearer ${token}`
    });}

  export const deleteGoalAPI =async (id, token) =>{
  return await CommonApi(`${base_url}/api/goal/delete/${id}`, "DELETE", undefined, {
      Authorization: `Bearer ${token}`
    });}
export const getGoalInsightsAPI = async (data, token) => {
  return await CommonApi(`${base_url}/api/goal/insights`, "POST", data, {
    Authorization: `Bearer ${token}`
  });
};
export const exportCSVAPI=async(token)=>{
  return await CommonApi(`${base_url}/api/export/csv`,'GET',"",{  
    Authorization: `Bearer ${token}`,
  })

}
export const deleteAccountAPI=async(token)=>{
  await CommonApi(`${base_url}/api/account/delete`,'DELETE',"",{
    Authorization: `Bearer ${token}`,
  })
}