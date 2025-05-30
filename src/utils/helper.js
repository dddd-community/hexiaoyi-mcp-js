const handleError = (errorData) => {
    return {
        content:[
            {
                type: "text",
                text: `${errorData instanceof Error ? errorData.message : String(errorData)}`
            }
        ],
        isError:true
    }
}

const handleSuccess = (successData) => {
    return {
        content:[
            {
                type: "text",
                text: JSON.stringify(successData)
            }
        ],
        isError:false,
    }
}

module.exports = {handleError, handleSuccess};