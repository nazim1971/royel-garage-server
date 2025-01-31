
import QueryBuilder from '../../builder/QueryBuilder';
import { productSrcField } from './bike.const';
import { Tbike } from './bike.interface';
import { Bike } from './bike.model';

const createBike = async (bikeData: Tbike) => {
  const result = await Bike.create(bikeData);
  return result;
};

const getAllBikeFromDB = async (payload: Record<string, unknown>) => {
  
    const productQuery = new QueryBuilder(
      Bike.find(),
      payload,
    )
      .search(productSrcField)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return { meta, result };
};

const getSingleBikeFromDB = async (id: string) => {
  const result = await Bike.findById({ _id: id });
  return result;
};

const updateSingleBikeInfo = async (
  id: string,
  updatedData: Partial<Tbike>,
) => {
  const result = await Bike.findByIdAndUpdate({ _id: id }, updatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSingleBikeFromDB= async ( id: string)=>{
  const result = await Bike.findOneAndDelete({_id: id})
  return result;
}
export const bikeService = {
  createBike,
  getAllBikeFromDB,
  getSingleBikeFromDB,
  updateSingleBikeInfo,
  deleteSingleBikeFromDB
};
