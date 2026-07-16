import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from './AxiosToastError'

const uploadImage = async(image)=>{
    try {
        const formData = new FormData()
        formData.append('image',image)

        const response = await Axios({
            ...SummaryApi.uploadImage,
            data : formData
        })

        return response
    } catch (error) {
        AxiosToastError(error)
        return {
            data: {
                success: false,
                data: {
                    url: ""
                }
            }
        }
    }
}

export default uploadImage