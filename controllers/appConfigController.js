import AppConfig from "../models/appConfigSchema.js"

export const createConfig = async(req, res) =>{
    try {
        const checkConfig = await AppConfig.findOne({})
        if(checkConfig){
            checkConfig.theme = req.body.theme;
            checkConfig.goalImages = req.body.goalImages;
            checkConfig.areaImages = req.body.areaImages;
            const updatedConfig = await checkConfig.save();
            return res.status(200).json(updatedConfig)
        }else{
            const newConfig = await AppConfig.create(req.body);
            return res.status(201).json(newConfig)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}



// test


export const getConfig = async(req, res) => {
    try {
        const config = await AppConfig.findOne({});
        return res.status(200).json(config)
    } catch (error) {
        res.status(500).json(error)
    }
}


