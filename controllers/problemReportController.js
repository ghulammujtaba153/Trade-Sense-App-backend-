import ProblemReport from "../models/problemReportSchema.js";


export const createProblem = async(req, res) =>{
    try {
        const problem = await ProblemReport.create(req.body);
        res.status(201).json(problem);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}



export const getAllProblem = async(req, res) => {
    try {
        const problem = await ProblemReport.find().populate('userId');
        res.status(200).json(problem);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}




export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const problem = await ProblemReport.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
