import * as BabyService from '../services/baby.service';
import * as ConsultationService from '../services/consultation.service';
import * as CostService from '../services/cost.service';
import * as UserService from '../services/user.service';
import * as VaccineService from '../services/vaccine.service';

export const resolvers = {
  Query: {
    users: () => UserService.getUsers(),
    babies: (_parent: unknown, args: { userId: number }) => BabyService.getBabies(args.userId),
    baby: (_parent: unknown, args: { id: number }) => BabyService.getBaby(args.id),
    consultations: (_parent: unknown, args: { babyId: number }) =>
      ConsultationService.getConsultations(args.babyId),
    vaccines: (_parent: unknown, args: { babyId: number }) => VaccineService.getVaccines(args.babyId),
    costs: (_parent: unknown, args: { babyId: number }) => CostService.getCosts(args.babyId),
    dashboardSummary: (_parent: unknown, args: { babyId: number }) =>
      BabyService.getDashboardSummary(args.babyId),
  },

  Mutation: {
    registerUser: (_parent: unknown, args: { input: Parameters<typeof UserService.registerUser>[0] }) =>
      UserService.registerUser(args.input),
    login: (_parent: unknown, args: { input: Parameters<typeof UserService.login>[0] }) =>
      UserService.login(args.input),

    createBaby: (_parent: unknown, args: { input: Parameters<typeof BabyService.createBaby>[0] }) =>
      BabyService.createBaby(args.input),
    updateBaby: (
      _parent: unknown,
      args: { id: number; input: Parameters<typeof BabyService.updateBaby>[1] },
    ) => BabyService.updateBaby(args.id, args.input),
    deleteBaby: (_parent: unknown, args: { id: number }) => BabyService.deleteBaby(args.id),

    createConsultation: (
      _parent: unknown,
      args: { input: Parameters<typeof ConsultationService.createConsultation>[0] },
    ) => ConsultationService.createConsultation(args.input),
    updateConsultation: (
      _parent: unknown,
      args: { id: number; input: Parameters<typeof ConsultationService.updateConsultation>[1] },
    ) => ConsultationService.updateConsultation(args.id, args.input),
    deleteConsultation: (_parent: unknown, args: { id: number }) =>
      ConsultationService.deleteConsultation(args.id),

    createVaccine: (
      _parent: unknown,
      args: { input: Parameters<typeof VaccineService.createVaccine>[0] },
    ) => VaccineService.createVaccine(args.input),
    updateVaccine: (
      _parent: unknown,
      args: { id: number; input: Parameters<typeof VaccineService.updateVaccine>[1] },
    ) => VaccineService.updateVaccine(args.id, args.input),
    deleteVaccine: (_parent: unknown, args: { id: number }) => VaccineService.deleteVaccine(args.id),

    createCost: (_parent: unknown, args: { input: Parameters<typeof CostService.createCost>[0] }) =>
      CostService.createCost(args.input),
    updateCost: (
      _parent: unknown,
      args: { id: number; input: Parameters<typeof CostService.updateCost>[1] },
    ) => CostService.updateCost(args.id, args.input),
    deleteCost: (_parent: unknown, args: { id: number }) => CostService.deleteCost(args.id),
  },
};
