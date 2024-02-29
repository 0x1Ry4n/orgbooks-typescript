import logger from "@/config/logger";

interface IViaCepResponseData {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
} 

type ViaCepResponse = {
    data: IViaCepResponseData;
    error: string | null;
}

const searchCep = async (cep: string): Promise<ViaCepResponse> => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        method: "GET"
    })
        .then(response => response.json())
    
    let data = response as IViaCepResponseData;
    let error = response?.erro || null;

    return { data, error };
  } catch(error) {
      logger.info(error);
      throw new Error(`Search cep service error: ${error}`)
  }
} 

export { 
    searchCep
}



