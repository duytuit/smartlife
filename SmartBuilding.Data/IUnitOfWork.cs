using System;
using System.Collections.Generic;
using System.Text;

namespace SmartBuilding.Data
{
    public interface IUnitOfWork : IDisposable
    {
        void BeginTransaction();
        void TransactionCommit();
        void Rollback();
        void Commit();
    }
}
